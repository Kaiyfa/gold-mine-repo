import os

# Define the project path
project_path = "/Users/adamasall/Desktop/software_project/gold-mine-repo"
output_file = "final_codebase.txt"

# Define file extensions to include
code_extensions = (".py", ".js", ".html", ".css", ".jsx", ".ts", ".tsx", ".sql", ".json", ".yaml", ".yml")

# Open a file to write the entire codebase
with open(output_file, "w", encoding="utf-8") as out_file:
    for root, dirs, files in os.walk(project_path):
        for file in files:
            if file.endswith(code_extensions):
                file_path = os.path.join(root, file)
                out_file.write(f"\n\n=== FILE: {file_path} ===\n\n")  # Header for each file
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        out_file.write(f.read())
                except Exception as e:
                    out_file.write(f"\n[ERROR: Cannot read file {file_path}] - {e}\n")

print(f"✅ Codebase successfully saved to: {output_file}")

