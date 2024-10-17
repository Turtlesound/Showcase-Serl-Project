import requests
import json

# GitHub API URL for a specific repository
repo_url = 'https://api.github.com/repos/livekit/agents'

# Make a GET request to the GitHub API
response = requests.get(repo_url)

# Check if the request was successful
if response.status_code == 200:
    repo_data = response.json()
    # Extract relevant information
    project_info = {
        "id": repo_data['name'],
        "title": repo_data['name'],
        "description": repo_data['description'],
        "type": "repository",  # Adjust this as needed
        "tags": [],  # Initialize an empty list for tags
        "screenshots": [],  # GitHub doesn't typically store screenshots
        "url": repo_data['html_url'],
        "created_at": repo_data['created_at'],
        "updated_at": repo_data['updated_at'],
        "author": repo_data['owner']['login']
    }

    # Check if topics is a list and extract tags
    topics = repo_data.get('topics', [])
    if isinstance(topics, list):  # Check if topics is a list
        project_info["projects/tags"] = [tag for tag in topics if tag]  # Directly use the tag strings

    # Save to a JSON file
    with open('projects.json', 'w') as json_file:
        json.dump([project_info], json_file, indent=4)

    print("Project information saved to projects.json.")
else:
    print("Failed to retrieve data:", response.status_code)
