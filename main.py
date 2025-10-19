import os


n = 0
def list_piano_files():
    global n
    folder_path = "piano"
    
    # Check if folder exists
    if not os.path.exists(folder_path):
        print(f"Error: Folder '{folder_path}' does not exist.")
        return
    
    # Get all files in the folder
    files = os.listdir(folder_path)
    
    # Print all files
    print(f"Files in '{folder_path}' folder:")
    for file in files:
        n += 1
        print(file)

# Run the function
list_piano_files()
print(n)