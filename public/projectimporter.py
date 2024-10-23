import requests
import json
import codecs

# GitHub API URL for a specific repository
repo_url = 'https://api.github.com/repos/andreas-bauer/credit-maker'

# Make a GET request to the repository
response = requests.get(repo_url)

# Check if the request was successful
if response.status_code == 200:
    repo_data = response.json()

    # Extract relevant information
    project_info = {
        "id": repo_data['name'],
        "title": repo_data['name'],
        "description": repo_data['description'],
        "type": "repository",  # choose here what type the project is
        "tags": [],  # Initialize an empty list for tags (might be best to change here to own tags as the github topics are not great)
        "screenshots": [],  # needs to be added manually
        "url": repo_data['html_url'],
        "created_at": repo_data['created_at'],
        "updated_at": repo_data['updated_at'],
        "author": repo_data['owner']['login'],
    }

    # Check if topics is a list and extract tags
    topics = repo_data.get('topics', [])
    if isinstance(topics, list):
        project_info["tags"] = [tag for tag in topics if tag]  

    # Get the README content using a separate API endpoint
    readme_url = f"{repo_url}/readme" 
    readme_response = requests.get(readme_url)
    
    # Check if the README request was successful
    if readme_response.status_code == 200:
        readme_data = readme_response.json()
        # Extract the description from the README (Markdown format)
        if readme_data.get('content', None):  # Check if content exists
            try:
                # Decode base64-encoded content using codecs.decode()
                decoded_content = codecs.decode(readme_data['content'].encode('utf-8'), 'base64')

                # Convert decoded content to a UTF-8 string
                project_info["description_long"] = decoded_content.decode('utf-8')
            except Exception as e:
                print(f"Error decoding/processing README: {e}")
                project_info["description_long"] = "Unable to process README content."
        else:
            project_info["description_long"] = "No README found."
    else:
        print(f"Failed to retrieve README: {readme_response.status_code}")
        project_info["description_long"] = "Failed to retrieve README."

    # Load existing projects from the JSON file
    try:
        with open('projects.json', 'r') as json_file:
            existing_data = json.load(json_file)

        # Initialize the projects list
        existing_projects = existing_data.get("projects", [])  # Extract the projects list

    except FileNotFoundError:
        existing_projects = []  # If file does not exist, start with an empty list
    except json.JSONDecodeError:
        existing_projects = []  # If file is empty or not valid JSON, start with an empty list

    # Append the new project to the existing projects
    existing_projects.append(project_info)

    # Save the updated list to the JSON file under the "projects" key
    with open('projects.json', 'w') as json_file:
        json.dump({"projects": existing_projects}, json_file, indent=4)

    print("Project information saved to projects.json.")
else:
    print("Failed to retrieve data:", response.status_code)
