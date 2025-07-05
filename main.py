#!/usr/bin/env python3
"""
main.py - A CLI tool for managing the Portfolio CMS Docker application.

This script provides commands to build and run the Docker container for the
portfolio application. It mimics the functionality of a Makefile with additional
explanatory text using argparse.

Commands:
    build     - Build the Docker image.
    up        - Start the application using docker-compose (with build).
    down      - Stop and remove the running container.
    run-dev   - Run the container in development mode (with hot-reloading).
    run-prod  - Run the container in production mode.
    logs      - Display the logs of the running container.
    dev       - Start the application in development mode using docker-compose.
    prod      - Start the application in production mode using docker-compose.
    cleanup   - Remove all stopped containers.
"""

import argparse
import subprocess
import sys
import os
from dotenv import load_dotenv
from pathlib import Path

dotenv_path = Path(__file__).resolve().parent / ".env"

if dotenv_path.exists():
    load_dotenv(dotenv_path)
else:
    print(f"⚠️  Warning: No .env file found at {dotenv_path}")
PORT = int(os.getenv("PORT", 5000))

def run_command(command, dry_run=False):
    """Utility function to run a shell command."""
    print(f"Executing: {' '.join(command)}")
    if dry_run:
        print("Dry run enabled: command not executed.")
        return
    try:
        subprocess.check_call(command)
    except subprocess.CalledProcessError as e:
        print(f"Error: Command failed with exit code {e.returncode}")
        sys.exit(e.returncode)

def build(args):
    """
    Build the Docker image for the portfolio application.
    
    Command:
      docker build -t application-portfolio .
      
    This command creates a Docker image named 'application-portfolio'
    from the Dockerfile in the current directory.
    """
    command = ["docker", "build", "-t", "application-portfolio", "."]
    run_command(command, args.dry_run)

def up(args):
    """
    Start the application using docker-compose with build.
    
    Command:
      docker-compose up --build
      
    This command uses docker-compose to build (if necessary) and start
    all defined services. It is useful for quickly starting your
    development or production environment.
    """
    command = ["docker-compose", "up", "--build"]
    run_command(command, args.dry_run)

def down(args):
    """
    Stop and remove the Docker container named 'portfolio'.
    
    Commands:
      docker stop portfolio
      docker rm portfolio
      
    These commands stop the running container and remove it from your Docker host.
    The '-' prefix is used to ignore errors if the container is not running.
    """
    command_stop = ["docker", "stop", "portfolio"]
    command_rm = ["docker", "rm", "portfolio"]
    run_command(command_stop, args.dry_run)
    run_command(command_rm, args.dry_run)

def run_dev(args):
    """
    Run the container in development mode with hot-reloading.
    
    Command:
      docker run -d -p 5000:5000 --name portfolio -v $(pwd)/app/:/app \
      -e FLASK_APP=app.py -e FLASK_ENV=development application-portfolio
      
    This command starts the container in detached mode (-d), maps port 5000,
    mounts the local 'app/' directory into the container, and sets environment
    variables to enable Flask's development mode.
    """
    current_dir = os.getcwd()
    volume_mapping = f"{current_dir}/app/:/app"
    command = [
        "docker", "run", "-d",
        "-p", f"{PORT}:{PORT}",
        "--name", "portfolio",
        "-v", volume_mapping,
        "-e", "FLASK_APP=app.py",
        "-e", "FLASK_ENV=development",
        "application-portfolio"
    ]
    run_command(command, args.dry_run)

def run_prod(args):
    """
    Run the container in production mode.
    
    Command:
      docker run -d -p 5000:5000 --name portfolio application-portfolio
      
    This command starts the container in detached mode, mapping port 5000,
    and runs the production version of the portfolio application.
    """
    command = [
        "docker", "run", "-d",
        "-p", "{PORT}:{PORT}",
        "--name", "portfolio",
        "application-portfolio"
    ]
    run_command(command, args.dry_run)

def logs(args):
    """
    Display the logs of the 'portfolio' container.
    
    Command:
      docker logs -f portfolio
      
    This command follows the logs (using -f) of the running container,
    which is helpful for debugging and monitoring.
    """
    command = ["docker", "logs", "-f", "portfolio"]
    run_command(command, args.dry_run)

def dev(args):
    """
    Run the application in development mode using docker-compose.
    
    Command:
      FLASK_ENV=development docker-compose up -d
      
    This command sets the FLASK_ENV environment variable to 'development'
    and starts the application using docker-compose, enabling hot-reloading.
    """
    env = os.environ.copy()
    env["FLASK_ENV"] = "development"
    command = ["docker-compose", "up", "-d"]
    print("Setting FLASK_ENV=development")
    run_command(command, args.dry_run)

def prod(args):
    """
    Run the application in production mode using docker-compose.
    
    Command:
      docker-compose up --build
      
    This command builds the Docker image if needed and starts the application
    using docker-compose for a production environment.
    """
    command = ["docker-compose", "up", "--build"]
    run_command(command, args.dry_run)

def cleanup(args):
    """
    Remove all stopped Docker containers.
    
    Command:
      docker container prune -f
      
    This command cleans up your Docker environment by forcefully removing
    all stopped containers. It is useful to reclaim disk space and remove
    unused containers.
    """
    command = ["docker", "container", "prune", "-f"]
    run_command(command, args.dry_run)
    
def delete_portfolio_container(dry_run=False):
    """
    Force remove the portfolio container if it exists.
    """
    print("Checking if 'portfolio' container exists to delete...")
    command = ["docker", "rm", "-f", "portfolio"]
    run_command(command, dry_run)

def browse(args):
    """
    Open http://localhost:5000 in Chromium browser.

    Command:
      chromium http://localhost:5000

    This command launches the Chromium browser to view the running application.
    """
    command = ["chromium", f"http://localhost:{PORT}"]
    run_command(command, args.dry_run)


def main():
    parser = argparse.ArgumentParser(
        description="CLI tool to manage the Portfolio CMS Docker application."
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print the commands without executing them."
    )
    
    parser.add_argument(
        "--delete",
        action="store_true",
        help="Delete the existing 'portfolio' container before running the command."
    )
    
    subparsers = parser.add_subparsers(
        title="Commands",
        description="Available commands to manage the application",
        dest="command"
    )

    # Browse command
    parser_browse = subparsers.add_parser(
        "browse", help="Open application in Chromium browser."
    )
    parser_browse.set_defaults(func=browse)

    # Build command
    parser_build = subparsers.add_parser(
        "build", help="Build the Docker image."
    )
    parser_build.set_defaults(func=build)
    
    # Up command (docker-compose up)
    parser_up = subparsers.add_parser(
        "up", help="Start the application using docker-compose (with build)."
    )
    parser_up.set_defaults(func=up)
    
    # Down command
    parser_down = subparsers.add_parser(
        "down", help="Stop and remove the Docker container."
    )
    parser_down.set_defaults(func=down)
    
    # Run-dev command
    parser_run_dev = subparsers.add_parser(
        "run-dev", help="Run the container in development mode (with hot-reloading)."
    )
    parser_run_dev.set_defaults(func=run_dev)
    
    # Run-prod command
    parser_run_prod = subparsers.add_parser(
        "run-prod", help="Run the container in production mode."
    )
    parser_run_prod.set_defaults(func=run_prod)
    
    # Logs command
    parser_logs = subparsers.add_parser(
        "logs", help="Display the logs of the running container."
    )
    parser_logs.set_defaults(func=logs)
    
    # Dev command (docker-compose with FLASK_ENV)
    parser_dev = subparsers.add_parser(
        "dev", help="Start the application in development mode using docker-compose."
    )
    parser_dev.set_defaults(func=dev)
    
    # Prod command (docker-compose production)
    parser_prod = subparsers.add_parser(
        "prod", help="Start the application in production mode using docker-compose."
    )
    parser_prod.set_defaults(func=prod)
    
    # Cleanup command
    parser_cleanup = subparsers.add_parser(
        "cleanup", help="Remove all stopped Docker containers."
    )
    parser_cleanup.set_defaults(func=cleanup)
    
    args = parser.parse_args()
    
    if args.command is None:
        parser.print_help()
        sys.exit(1)

    if args.delete:
        delete_portfolio_container(args.dry_run)
    
    # Execute the chosen subcommand function
    args.func(args)

if __name__ == "__main__":
    main()
