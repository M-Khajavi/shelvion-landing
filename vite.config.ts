import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoName = process.env.GITHUB_REPOSITORY?.split('/').pop() || 'shelvion-landing'

export default defineConfig({
  plugins: [react()],
  // Repository URL: /<repo>/ ; custom domain/subdomain: /.
  // Set VITE_BASE_PATH=/ in GitHub repository variables for the custom-domain stage.
  base: process.env.VITE_BASE_PATH || (process.env.GITHUB_ACTIONS ? `/${repoName}/` : '/'),
})
