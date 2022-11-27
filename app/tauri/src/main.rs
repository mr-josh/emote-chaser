#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[tauri::command]
async fn enable_clickthrough(window: tauri::Window) {
  window.set_ignore_cursor_events(true).unwrap();
}

#[derive(serde::Serialize)]
struct MousePos {
  x: i32,
  y: i32,
}

#[tauri::command]
async fn get_cursor() -> MousePos {
  let pos = enigo::Enigo::mouse_location();

  MousePos {
    x: pos.0,
    y: pos.1,
  }
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![enable_clickthrough, get_cursor])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
