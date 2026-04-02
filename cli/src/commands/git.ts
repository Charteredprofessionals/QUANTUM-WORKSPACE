/**
 * Git CLI Commands
 * Full Git integration for the AI Dev Suite CLI
 */

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { GitOps, createGit, GitStatus } from '../utils/git.js';

export function createGitCommands(): Command {
  const git = createGit();
  const gitCmd = new Command('git');
  
  gitCmd
    .description('Git operations - commits, branches, PRs')
    .action(() => {
      console.log(chalk.blue('\n📊 Git Operations\n'));
      console.log('Use subcommands: status, commit, branch, pr, etc.\n');
    });

  // git status
  gitCmd
    .command('status')
    .alias('st')
    .description('Show working tree status')
    .action(() => {
      try {
        const status = git.getStatus();
        
        console.log(chalk.blue(`\nOn branch: ${chalk.bold(status.branch)}\n`));
        
        if (status.ahead > 0) {
          console.log(chalk.yellow(`  ↑ ${status.ahead} commits ahead of origin`));
        }
        if (status.behind > 0) {
          console.log(chalk.yellow(`  ↓ ${status.behind} commits behind origin`));
        }
        
        if (status.staged.length > 0) {
          console.log(chalk.green('\nChanges to be committed:'));
          status.staged.forEach(f => console.log(chalk.green(`    ${chalk.bold('modified:')} ${f}`)));
        }
        
        if (status.modified.length > 0) {
          console.log(chalk.red('\nChanges not staged for commit:'));
          status.modified.forEach(f => console.log(chalk.red(`    modified: ${f}`)));
        }
        
        if (status.untracked.length > 0) {
          console.log(chalk.gray('\nUntracked files:'));
          status.untracked.forEach(f => console.log(chalk.gray(`    ${f}`)));
        }
        
        if (status.staged.length === 0 && status.modified.length === 0 && status.untracked.length === 0) {
          console.log(chalk.green('\n✅ Working tree clean'));
        }
        
        console.log('');
      } catch (e) {
        console.log(chalk.red(`\n❌ Error: ${(e as Error).message}\n`));
      }
    });

  // git commit
  gitCmd
    .command('commit')
    .alias('ci')
    .description('Commit staged changes')
    .option('-m, --message <message>', 'Commit message')
    .option('-a, --all', 'Stage all modified files')
    .action(async (options) => {
      try {
        const status = git.getStatus();
        
        if (status.staged.length === 0) {
          if (options.all) {
            git.stage(['-u']);
            console.log(chalk.blue('\n✅ Staged all modified files\n'));
          } else {
            console.log(chalk.yellow('\n⚠️ No changes staged. Use -a to stage all.\n'));
            return;
          }
        }
        
        let message = options.message;
        
        if (!message) {
          const answers = await inquirer.prompt([
            {
              type: 'input',
              name: 'message',
              message: 'Commit message:',
              validate: (input: string) => input.length > 0 ? true : 'Message required'
            },
            {
              type: 'input',
              name: 'description',
              message: 'Extended description (optional):'
            }
          ]);
          
          message = answers.description 
            ? `${answers.message}\n\n${answers.description}`
            : answers.message;
        }
        
        const hash = git.commit(message);
        console.log(chalk.green(`\n✅ Committed: ${hash}\n`));
        
        // Ask to push
        const { shouldPush } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'shouldPush',
            message: 'Push to remote?',
            default: false
          }
        ]);
        
        if (shouldPush) {
          git.push();
          console.log(chalk.green('✅ Pushed to remote\n'));
        }
      } catch (e) {
        console.log(chalk.red(`\n❌ Error: ${(e as Error).message}\n`));
      }
    });

  // git branch
  const branchCmd = gitCmd
    .command('branch')
    .alias('br')
    .description('List, create, or delete branches');

  branchCmd
    .action(() => {
      try {
        const branches = git.listBranches(false);
        const current = git.getCurrentBranch();
        
        console.log(chalk.blue('\nLocal Branches:\n'));
        branches.forEach(b => {
          const prefix = b.name === current ? chalk.green('* ') : '  ';
          console.log(`${prefix}${chalk.bold(b.name)}`);
        });
        
        const remoteBranches = git.listBranches(true).filter(b => b.isRemote);
        if (remoteBranches.length > 0) {
          console.log(chalk.blue('\nRemote Branches:\n'));
          remoteBranches.forEach(b => {
            console.log(`  ${chalk.gray(b.name)}`);
          });
        }
        
        console.log('');
      } catch (e) {
        console.log(chalk.red(`\n❌ Error: ${(e as Error).message}\n`));
      }
    });

  branchCmd
    .command('create <name>')
    .description('Create and switch to a new branch')
    .action((name: string) => {
      try {
        git.createBranch(name, true);
        console.log(chalk.green(`\n✅ Created branch: ${name}\n`));
      } catch (e) {
        console.log(chalk.red(`\n❌ Error: ${(e as Error).message}\n`));
      }
    });

  branchCmd
    .command('delete <name>')
    .description('Delete a local branch')
    .option('-f, --force', 'Force delete')
    .action((name: string, options) => {
      try {
        git.deleteBranch(name, options.force);
        console.log(chalk.green(`\n✅ Deleted branch: ${name}\n`));
      } catch (e) {
        console.log(chalk.red(`\n❌ Error: ${(e as Error).message}\n`));
      }
    });

  // git checkout
  gitCmd
    .command('checkout')
    .alias('co')
    .description('Switch branches')
    .argument('[branch]', 'Branch to checkout')
    .option('-c, --create <branch>', 'Create and switch to new branch')
    .action((branch: string, options) => {
      try {
        if (options.create) {
          git.checkout(options.create, true);
          console.log(chalk.green(`\n✅ Created and switched to: ${options.create}\n`));
        } else if (branch) {
          git.checkout(branch, false);
          console.log(chalk.green(`\n✅ Switched to: ${branch}\n`));
        } else {
          console.log(chalk.yellow('\n⚠️ Specify a branch or use -c <name>\n'));
        }
      } catch (e) {
        console.log(chalk.red(`\n❌ Error: ${(e as Error).message}\n`));
      }
    });

  // git push
  gitCmd
    .command('push')
    .alias('push')
    .description('Push commits to remote')
    .option('-f, --force', 'Force push')
    .option('-u, --set-upstream', 'Set upstream')
    .action((options) => {
      try {
        git.push(undefined, options.force);
        console.log(chalk.green('\n✅ Pushed to remote\n'));
      } catch (e) {
        console.log(chalk.red(`\n❌ Error: ${(e as Error).message}\n`));
      }
    });

  // git pull
  gitCmd
    .command('pull')
    .description('Pull changes from remote')
    .action(() => {
      try {
        git.pull();
        console.log(chalk.green('\n✅ Pulled from remote\n'));
      } catch (e) {
        console.log(chalk.red(`\n❌ Error: ${(e as Error).message}\n`));
      }
    });

  // git fetch
  gitCmd
    .command('fetch')
    .description('Fetch from remote')
    .action(() => {
      try {
        git.fetch();
        console.log(chalk.green('\n✅ Fetched from remote\n'));
      } catch (e) {
        console.log(chalk.red(`\n❌ Error: ${(e as Error).message}\n`));
      }
    });

  // git diff
  gitCmd
    .command('diff')
    .description('Show changes')
    .option('-s, --staged', 'Show staged changes')
    .action((options) => {
      try {
        const diff = git.diff(options.staged);
        if (diff) {
          console.log(diff);
        } else {
          console.log(chalk.yellow('\n⚠️ No changes\n'));
        }
      } catch (e) {
        console.log(chalk.red(`\n❌ Error: ${(e as Error).message}\n`));
      }
    });

  // git log
  gitCmd
    .command('log')
    .alias('lg')
    .description('Show commit history')
    .option('-n, --count <number>', 'Number of commits', '10')
    .action((options) => {
      try {
        const count = parseInt(options.count) || 10;
        const commits = git.getLog(count);
        
        console.log(chalk.blue(`\nLast ${commits.length} commits:\n`));
        commits.forEach(c => {
          console.log(chalk.bold(c.hash), chalk.gray(c.date.split(' ')[0]));
          console.log(`  ${c.message}`);
          console.log(chalk.gray(`  by ${c.author}\n`));
        });
      } catch (e) {
        console.log(chalk.red(`\n❌ Error: ${(e as Error).message}\n`));
      }
    });

  // PR commands
  const prCmd = gitCmd
    .command('pr')
    .description('Pull request operations');

  prCmd
    .command('create')
    .alias('new')
    .description('Create a pull request')
    .option('-t, --title <title>', 'PR title')
    .option('-b, --body <body>', 'PR description')
    .option('-d, --draft', 'Create as draft')
    .action(async (options) => {
      try {
        let title = options.title;
        let body = options.body;
        
        if (!title) {
          const status = git.getStatus();
          const answers = await inquirer.prompt([
            {
              type: 'input',
              name: 'title',
              message: 'PR title:',
              default: `Feature: ${status.branch}`
            },
            {
              type: 'editor',
              name: 'body',
              message: 'PR description (optional):',
              default: ''
            }
          ]);
          
          title = answers.title;
          body = answers.body;
        }
        
        const pr = await git.createPR({
          title,
          body,
          head: git.getCurrentBranch(),
          draft: options.draft
        });
        
        console.log(chalk.green(`\n✅ PR created: ${pr.url}\n`));
      } catch (e) {
        console.log(chalk.red(`\n❌ Error: ${(e as Error).message}\n`));
      }
    });

  prCmd
    .command('list')
    .description('List pull requests')
    .option('-s, --state <state>', 'State (open/closed/all)', 'open')
    .action((options) => {
      try {
        const prs = git.listPRs(options.state as any);
        
        if (prs.length === 0) {
          console.log(chalk.yellow('\n⚠️ No pull requests found\n'));
          return;
        }
        
        console.log(chalk.blue(`\nPull Requests (${options.state}):\n`));
        prs.forEach(pr => {
          const stateColor = pr.state === 'open' ? chalk.green : chalk.red;
          console.log(`  #${pr.number} ${chalk.bold(pr.title)}`);
          console.log(`    ${stateColor(pr.state)} - ${pr.url}\n`);
        });
      } catch (e) {
        console.log(chalk.red(`\n❌ Error: ${(e as Error).message}\n`));
      }
    });

  prCmd
    .command('merge <number>')
    .description('Merge a pull request')
    .option('-m, --method <method>', 'Merge method (merge/squash/rebase)', 'merge')
    .action((number: string, options) => {
      try {
        git.mergePR(parseInt(number), options.method as any);
        console.log(chalk.green(`\n✅ PR #${number} merged\n`));
      } catch (e) {
        console.log(chalk.red(`\n❌ Error: ${(e as Error).message}\n`));
      }
    });

  // git stash
  const stashCmd = gitCmd
    .command('stash')
    .description('Stash changes');

  stashCmd.action(() => {
    try {
      const list = git.stashList();
      if (list.length === 0) {
        console.log(chalk.yellow('\n⚠️ No stashes\n'));
      } else {
        console.log(chalk.blue('\nStashes:\n'));
        list.forEach(s => console.log(`  ${s}`));
        console.log('');
      }
    } catch (e) {
      console.log(chalk.red(`\n❌ Error: ${(e as Error).message}\n`));
    }
  });

  stashCmd
    .command('push')
    .description('Stash changes')
    .option('-m, --message <message>', 'Stash message')
    .action((options) => {
      try {
        git.stash(options.message);
        console.log(chalk.green('\n✅ Stashed changes\n'));
      } catch (e) {
        console.log(chalk.red(`\n❌ Error: ${(e as Error).message}\n`));
      }
    });

  stashCmd
    .command('pop')
    .description('Apply and remove stash')
    .action(() => {
      try {
        git.stashPop();
        console.log(chalk.green('\n✅ Applied stash\n'));
      } catch (e) {
        console.log(chalk.red(`\n❌ Error: ${(e as Error).message}\n`));
      }
    });

  // git merge
  gitCmd
    .command('merge <branch>')
    .description('Merge a branch into current')
    .option('--no-ff', 'No fast-forward')
    .action((branch: string, options) => {
      try {
        git.merge(branch, options.noff);
        console.log(chalk.green(`\n✅ Merged ${branch}\n`));
      } catch (e) {
        console.log(chalk.red(`\n❌ Error: ${(e as Error).message}\n`));
      }
    });

  return gitCmd;
}