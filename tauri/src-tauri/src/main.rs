#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            println!("🚀 Quantum Workspace starting...");
            
            // Get the main window
            let window = app.get_window("main").unwrap();
            
            // Set window title
            window.set_title("Quantum Workspace").unwrap();
            
            // Maximize on startup (optional)
            // window.maximize().unwrap();
            
            println!("✅ Quantum Workspace ready!");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}