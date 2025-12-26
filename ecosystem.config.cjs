module.exports = {
  apps: [
    {
      name: "nextjs-app",
      script: "npm",
      args: "start",
      exec_mode: "fork",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3001, // BURASI GÜNCELLENDİ: Next.js artık 3001'de kalkacak
      },
    },
  ],
};