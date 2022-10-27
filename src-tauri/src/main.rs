#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]


use std::path::{Path, PathBuf};
use serde_json::to_string;

use tauri::api::process::{Command, ExitStatus};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![convert_video_format])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[derive(serde::Serialize)]
struct ConvertResponse {
    out_file: String,
    output: String,
    status: i32,
}

/// format: 转换的格式，例如 mp4
#[tauri::command]
async fn convert_video_format(in_file: String,out_file: String) -> Result<ConvertResponse, String> {
    println!("convert start: in={}, out={}", in_file, out_file);
    let out = Command::new("ffmpeg")
        .args(vec!["-i", in_file.as_str(), out_file.as_str()])
        .output()
        .expect("Failed to run ffmpeg");
    println!("run out status: {:?}", out.status);
    println!("run out: {}", out.stderr);
    if out.status.success() {
        Ok(ConvertResponse {
            out_file,
            output: out.stderr,
            status: out.status.code().unwrap_or_default(),
        })
    } else {
        Err(format!("Convert failed: {}", out.stderr.lines().last().unwrap_or("no error message")))
    }

}