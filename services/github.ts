
import { GithubProfile, GithubRepo } from '../types';

const GITHUB_USERNAME = 'yeswanthram28';

export async function fetchGithubProfile(): Promise<GithubProfile> {
  const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
  if (!response.ok) throw new Error('Failed to fetch profile');
  return response.json();
}

export async function fetchGithubRepos(): Promise<GithubRepo[]> {
  const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
  if (!response.ok) throw new Error('Failed to fetch repos');
  const repos = await response.json();
  // Filter for meaningful repos (those with descriptions or stars usually)
  return repos.filter((repo: GithubRepo) => !repo.name.startsWith('.'));
}

