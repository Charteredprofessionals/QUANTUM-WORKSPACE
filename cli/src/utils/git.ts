/**
 * Git Operations Module
 * Full Git integration: commits, branches, PRs, merges
 */

import { execSync, exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export interface GitStatus {
  branch: string;
  modified: string[];
  staged: string[];
  untracked: string[];
  ahead: number;
  behind: number;
}

export interface GitCommit {
  hash: string;
  message: string;
  author: string;
  date: string;
}

export interface Branch {
  name: string;
  isRemote: boolean;
  lastCommit: string;
}

export interface PullRequest {
  number: number;
  title: string;
  state: string;
  author: string;
  url: string;
}

export class GitOps {
  private repoPath: string;
  private remoteUrl: string = '';
  private owner: string = '';
  private repo: string = '';

  constructor(repoPath: string = process.cwd()) {
    this.repoPath = repoPath;
    this.detectRemote();
  }

  private detectRemote(): void {
    try {
      const url = execSync('git remote get-url origin', { 
        cwd: this.repoPath, 
        encoding: 'utf-8' 
      }).trim();
      
      this.remoteUrl = url;
      
      // Parse owner/repo from URL
      if (url.includes('github.com')) {
        const match = url.match(/github\.com[/:]([^/]+)\/([^/.]+)/);
        if (match) {
          this.owner = match[1];
          this.repo = match[2].replace('.git', '');
        }
      }
    } catch (e) {
      // No remote configured
    }
  }

  // ========================================
  // STATUS
  // ========================================

  getStatus(): GitStatus {
    try {
      const branch = execSync('git branch --show-current', { 
        cwd: this.repoPath, encoding: 'utf-8' 
      }).trim();

      const status = execSync('git status --porcelain', { 
        cwd: this.repoPath, encoding: 'utf-8' 
      });

      const modified: string[] = [];
      const staged: string[] = [];
      const untracked: string[] = [];

      status.split('\n').filter(Boolean).forEach(line => {
        const statusCode = line.substring(0, 2);
        const file = line.substring(3);
        
        if (statusCode.includes('M')) modified.push(file);
        if (statusCode.includes('A')) staged.push(file);
        if (statusCode === '??') untracked.push(file);
      });

      // Get ahead/behind
      let ahead = 0, behind = 0;
      try {
        const revInfo = execSync('git rev-list --left-right --count HEAD...origin/' + branch, {
          cwd: this.repoPath, encoding: 'utf-8'
        }).trim();
        const [a, b] = revInfo.split('\t');
        ahead = parseInt(a);
        behind = parseInt(b);
      } catch (e) {
        // Not tracking against remote
      }

      return { branch, modified, staged, untracked, ahead, behind };
    } catch (e) {
      throw new Error('Not a git repository');
    }
  }

  // ========================================
  // BRANCHES
  // ========================================

  listBranches(remote: boolean = false): Branch[] {
    try {
      const flag = remote ? '-r' : '--list';
      const output = execSync(`git branch ${flag} --format="%(refname:short)|%(subject)"`, {
        cwd: this.repoPath, encoding: 'utf-8'
      });

      return output.split('\n').filter(Boolean).map(line => {
        const [name, lastCommit] = line.split('|');
        return {
          name: name.trim(),
          isRemote: remote || name.startsWith('remotes/'),
          lastCommit: lastCommit?.trim() || ''
        };
      });
    } catch (e) {
      return [];
    }
  }

  createBranch(name: string, checkout: boolean = true): void {
    try {
      execSync(`git branch ${name}`, { cwd: this.repoPath, stdio: 'pipe' });
      if (checkout) {
        this.checkout(name);
      }
    } catch (e) {
      throw new Error(`Failed to create branch: ${name}`);
    }
  }

  checkout(branch: string, create: boolean = false): void {
    try {
      if (create) {
        execSync(`git checkout -b ${branch}`, { cwd: this.repoPath, stdio: 'pipe' });
      } else {
        execSync(`git checkout ${branch}`, { cwd: this.repoPath, stdio: 'pipe' });
      }
    } catch (e) {
      throw new Error(`Failed to checkout branch: ${branch}`);
    }
  }

  deleteBranch(name: string, force: boolean = false): void {
    try {
      const flag = force ? '-D' : '-d';
      execSync(`git branch ${flag} ${name}`, { cwd: this.repoPath, stdio: 'pipe' });
    } catch (e) {
      throw new Error(`Failed to delete branch: ${name}`);
    }
  }

  // ========================================
  // COMMITS
  // ========================================

  getLog(count: number = 10): GitCommit[] {
    try {
      const output = execSync(`git log -${count} --format="%H|%s|%an|%ai"`, {
        cwd: this.repoPath, encoding: 'utf-8'
      });

      return output.split('\n').filter(Boolean).map(line => {
        const [hash, message, author, date] = line.split('|');
        return { hash: hash.substring(0, 7), message, author, date };
      });
    } catch (e) {
      return [];
    }
  }

  stage(files: string[] | string = ['.']): void {
    const filesStr = Array.isArray(files) ? files.join(' ') : files;
    try {
      execSync(`git add ${filesStr}`, { cwd: this.repoPath, stdio: 'pipe' });
    } catch (e) {
      throw new Error('Failed to stage files');
    }
  }

  unstage(files: string[] | string = ['.']): void {
    const filesStr = Array.isArray(files) ? files.join(' ') : files;
    try {
      execSync(`git reset HEAD ${filesStr}`, { cwd: this.repoPath, stdio: 'pipe' });
    } catch (e) {
      throw new Error('Failed to unstage files');
    }
  }

  commit(message: string): string {
    try {
      // Escape message for shell
      const escapedMsg = message.replace(/"/g, '\\"');
      const output = execSync(`git commit -m "${escapedMsg}"`, {
        cwd: this.repoPath,
        encoding: 'utf-8'
      });
      
      // Get the commit hash
      const hash = execSync('git rev-parse HEAD', {
        cwd: this.repoPath, encoding: 'utf-8'
      }).trim().substring(0, 7);
      
      return hash;
    } catch (e) {
      throw new Error('Failed to commit. Do you have staged changes?');
    }
  }

  amend(message?: string): string {
    try {
      if (message) {
        const escapedMsg = message.replace(/"/g, '\\"');
        execSync(`git commit --amend -m "${escapedMsg}"`, {
          cwd: this.repoPath, stdio: 'pipe'
        });
      } else {
        execSync('git commit --amend --no-edit', {
          cwd: this.repoPath, stdio: 'pipe'
        });
      }
      
      return execSync('git rev-parse HEAD', {
        cwd: this.repoPath, encoding: 'utf-8'
      }).trim().substring(0, 7);
    } catch (e) {
      throw new Error('Failed to amend commit');
    }
  }

  // ========================================
  // REMOTE OPERATIONS
  // ========================================

  push(branch?: string, force: boolean = false): void {
    try {
      const flag = force ? '-f' : '';
      const branchStr = branch || '';
      execSync(`git push ${flag} ${branchStr}`, { cwd: this.repoPath, stdio: 'pipe' });
    } catch (e) {
      throw new Error('Failed to push. Check your remote and permissions.');
    }
  }

  pull(): void {
    try {
      execSync('git pull', { cwd: this.repoPath, stdio: 'pipe' });
    } catch (e) {
      throw new Error('Failed to pull. Check for conflicts.');
    }
  }

  fetch(): void {
    try {
      execSync('git fetch --all', { cwd: this.repoPath, stdio: 'pipe' });
    } catch (e) {
      throw new Error('Failed to fetch from remote');
    }
  }

  // ========================================
  // DIFF
  // ========================================

  diff(staged: boolean = false): string {
    try {
      const flag = staged ? '--staged' : '';
      return execSync(`git diff ${flag}`, {
        cwd: this.repoPath, encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024
      });
    } catch (e) {
      return '';
    }
  }

  diffCommit(commit: string): string {
    try {
      return execSync(`git show ${commit} --format="" --patch`, {
        cwd: this.repoPath, encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024
      });
    } catch (e) {
      return '';
    }
  }

  // ========================================
  // MERGE & REBASE
  // ========================================

  merge(branch: string, noFF: boolean = true): void {
    try {
      const flag = noFF ? '--no-ff' : '';
      execSync(`git merge ${flag} ${branch}`, { cwd: this.repoPath, stdio: 'pipe' });
    } catch (e) {
      throw new Error(`Merge failed. Resolve conflicts and commit.`);
    }
  }

  rebase(branch: string): void {
    try {
      execSync(`git rebase ${branch}`, { cwd: this.repoPath, stdio: 'pipe' });
    } catch (e) {
      throw new Error('Rebase failed. Use "git rebase --abort" to cancel.');
    }
  }

  abortRebase(): void {
    execSync('git rebase --abort', { cwd: this.repoPath, stdio: 'pipe' });
  }

  // ========================================
  // PULL REQUESTS (GitHub CLI)
  // ========================================

  async createPR(options: {
    title: string;
    body?: string;
    base?: string;
    head?: string;
    draft?: boolean;
  }): Promise<PullRequest> {
    // Use gh CLI if available
    try {
      const args = [
        'pr', 'create',
        '--title', options.title,
        '--base', options.base || 'main',
        '--head', options.head || ''
      ];
      
      if (options.body) args.push('--body', options.body);
      if (options.draft) args.push('--draft');
      
      const output = execSync(args.join(' '), {
        cwd: this.repoPath,
        encoding: 'utf-8'
      });
      
      // Parse PR URL to get number
      const url = output.trim();
      const match = url.match(/\/pull\/(\d+)/);
      
      return {
        number: parseInt(match?.[1] || '0'),
        title: options.title,
        state: 'open',
        author: this.owner,
        url
      };
    } catch (e) {
      throw new Error('Failed to create PR. Ensure gh CLI is installed and authenticated.');
    }
  }

  listPRs(state: 'open' | 'closed' | 'all' = 'open'): PullRequest[] {
    try {
      const output = execSync(`gh pr list --state ${state} --json number,title,state,authorLogin,url`, {
        cwd: this.repoPath,
        encoding: 'utf-8'
      });
      
      return JSON.parse(output).map((pr: any) => ({
        number: pr.number,
        title: pr.title,
        state: pr.state,
        author: pr.authorLogin,
        url: pr.url
      }));
    } catch (e) {
      return [];
    }
  }

  getPR(number: number): PullRequest | null {
    try {
      const output = execSync(`gh pr view ${number} --json number,title,state,authorLogin,url`, {
        cwd: this.repoPath,
        encoding: 'utf-8'
      });
      
      const pr = JSON.parse(output);
      return {
        number: pr.number,
        title: pr.title,
        state: pr.state,
        author: pr.authorLogin,
        url: pr.url
      };
    } catch (e) {
      return null;
    }
  }

  mergePR(number: number, method: 'merge' | 'squash' | 'rebase' = 'merge'): void {
    try {
      execSync(`gh pr merge ${number} --${method}`, { cwd: this.repoPath, stdio: 'pipe' });
    } catch (e) {
      throw new Error('Failed to merge PR');
    }
  }

  closePR(number: number): void {
    try {
      execSync(`gh pr close ${number}`, { cwd: this.repoPath, stdio: 'pipe' });
    } catch (e) {
      throw new Error('Failed to close PR');
    }
  }

  // ========================================
  // STASH
  // ========================================

  stash(message?: string): void {
    try {
      const msg = message ? `-m "${message}"` : '';
      execSync(`git stash push ${msg}`, { cwd: this.repoPath, stdio: 'pipe' });
    } catch (e) {
      throw new Error('Failed to stash changes');
    }
  }

  stashPop(): void {
    try {
      execSync('git stash pop', { cwd: this.repoPath, stdio: 'pipe' });
    } catch (e) {
      throw new Error('Failed to pop stash');
    }
  }

  stashList(): string[] {
    try {
      const output = execSync('git stash list', { cwd: this.repoPath, encoding: 'utf-8' });
      return output.split('\n').filter(Boolean);
    } catch (e) {
      return [];
    }
  }

  // ========================================
  // TAGS
  // ========================================

  createTag(name: string, message?: string): void {
    try {
      const msg = message ? `-m "${message}"` : '';
      execSync(`git tag -a ${name} ${msg}`, { cwd: this.repoPath, stdio: 'pipe' });
    } catch (e) {
      throw new Error('Failed to create tag');
    }
  }

  pushTag(name: string): void {
    try {
      execSync(`git push origin ${name}`, { cwd: this.repoPath, stdio: 'pipe' });
    } catch (e) {
      throw new Error('Failed to push tag');
    }
  }

  listTags(): string[] {
    try {
      const output = execSync('git tag list', { cwd: this.repoPath, encoding: 'utf-8' });
      return output.split('\n').filter(Boolean);
    } catch (e) {
      return [];
    }
  }

  // ========================================
  // UTILITIES
  // ========================================

  getCurrentBranch(): string {
    try {
      return execSync('git branch --show-current', {
        cwd: this.repoPath, encoding: 'utf-8'
      }).trim();
    } catch (e) {
      return '';
    }
  }

  getRemoteUrl(): string {
    return this.remoteUrl;
  }

  getOwnerRepo(): { owner: string; repo: string } {
    return { owner: this.owner, repo: this.repo };
  }

  isRepo(): boolean {
    try {
      execSync('git rev-parse --git-dir', { cwd: this.repoPath, stdio: 'pipe' });
      return true;
    } catch (e) {
      return false;
    }
  }
}

// Factory function
export function createGit(repoPath?: string): GitOps {
  return new GitOps(repoPath);
}