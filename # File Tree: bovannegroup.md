# File Tree: bovannegroup

Generated on: 9/20/2025, 10:14:15 AM
Root path: `/Users/agbakoukoffi/projets/modeste/bovannegroup`

```
├── 📁 .git/ 🚫 (auto-hidden)
├── 📁 backends/
│   └── 📁 user_service/
│       ├── 📁 config/
│       │   ├── 📄 config.js
│       │   ├── 📄 config.json
│       │   └── 📄 config.ts
│       ├── 📁 dist/ 🚫 (auto-hidden)
│       ├── 📁 migrations/
│       │   ├── 📄 20241123105559-create-whatsapp-numbers.js
│       │   └── 📄 20241123111435-create-socialMediaAccount.js
│       ├── 📁 models/
│       │   └── 📄 index.js
│       ├── 📁 node_modules/ 🚫 (auto-hidden)
│       ├── 📁 public/
│       │   └── 📁 uploads/
│       │       ├── 🖼️ 1754479640565-scaled_1000325308.jpg
│       │       ├── 🖼️ 1754480795495-scaled_1000331506.jpg
│       │       ├── 🖼️ 1754481876236-scaled_1000331507.jpg
│       │       ├── 🖼️ 1754567777278-scaled_1000332051.jpg
│       │       ├── 🖼️ 1758354996791-image.jpg
│       │       ├── 🖼️ 1758358295330-10.png
│       │       └── 🖼️ profile.png
│       ├── 📁 src/
│       │   ├── 📁 auth/
│       │   │   ├── 📄 private_key.ts
│       │   │   └── 📄 refresh_key.ts
│       │   ├── 📁 config/
│       │   │   ├── 📄 allowedOrigins.ts
│       │   │   ├── 📄 corsOptions.ts
│       │   │   ├── 📄 dotenv.config.ts
│       │   │   ├── 📄 private_key.ts
│       │   │   ├── 📄 refresh_key.ts
│       │   │   └── 📄 swagger.config.ts
│       │   ├── 📁 data/
│       │   │   ├── 📄 mock-continent.ts
│       │   │   ├── 📄 mock-permission.ts
│       │   │   └── 📄 roles.ts
│       │   ├── 📁 db/
│       │   │   └── 📄 sequelize.ts
│       │   ├── 📁 interfaces/
│       │   │   ├── 📄 apiResponseSms.ts
│       │   │   ├── 📄 invitationAttributes.ts
│       │   │   ├── 📄 permissionAttributes.ts
│       │   │   ├── 📄 profileAttributes.ts
│       │   │   ├── 📄 refreshTokenAttributes.ts
│       │   │   ├── 📄 roleAttributes.ts
│       │   │   ├── 📄 rolepermissionAttributes.ts
│       │   │   ├── 📄 socialMediaAccountAttributes.ts
│       │   │   ├── 📄 utilisateurAttributes.ts
│       │   │   └── 📄 whatsAppNumberAttributes.ts
│       │   ├── 📁 middlewares/
│       │   │   ├── 📄 auth.ts
│       │   │   └── 📄 authSwagger.ts
│       │   ├── 📁 models/
│       │   │   ├── 📄 invitation.ts
│       │   │   ├── 📄 permission.ts
│       │   │   ├── 📄 profile.ts
│       │   │   ├── 📄 refreshToken.ts
│       │   │   ├── 📄 role.ts
│       │   │   ├── 📄 rolepermission.ts
│       │   │   ├── 📄 socialMediaAccount.ts
│       │   │   ├── 📄 utilisateur.ts
│       │   │   └── 📄 whatsAppNumber.ts
│       │   ├── 📁 public/
│       │   │   └── 📁 tmp/ 🚫 (auto-hidden)
│       │   ├── 📁 routes/
│       │   │   ├── 📄 auth.ts
│       │   │   ├── 📄 download.ts
│       │   │   ├── 📄 permissions.ts
│       │   │   ├── 📄 profile.ts
│       │   │   ├── 📄 reinitialser.ts
│       │   │   ├── 📄 roles.ts
│       │   │   ├── 📄 socialMediaAccount.ts
│       │   │   ├── 📄 utilisateur.ts
│       │   │   └── 📄 whatsAppNumber.ts
│       │   ├── 📄 app.ts
│       │   └── 📄 swagger.ts
│       ├── 📄 .DS_Store 🚫 (auto-hidden)
│       ├── 📄 .dockerignore
│       ├── 🔒 .env 🚫 (auto-hidden)
│       ├── 🚫 .gitignore
│       ├── 📄 .sequelizerc
│       ├── 🐳 Dockerfile
│       ├── 📖 README.md
│       ├── 📄 package-lock.json
│       ├── 📄 package.json
│       └── 📄 tsconfig.json
├── 📁 frontends/
│   └── 📁 influenceHub/
│       ├── 📁 .vite/
│       │   └── 📁 deps/
│       │       ├── 📄 _metadata.json
│       │       └── 📄 package.json
│       ├── 📁 .vscode/ 🚫 (auto-hidden)
│       ├── 📁 node_modules/ 🚫 (auto-hidden)
│       ├── 📁 public/
│       │   └── 🖼️ favicon.ico
│       ├── 📁 src/
│       │   ├── 📁 assets/
│       │   │   └── 🎨 main.css
│       │   ├── 📁 components/
│       │   │   └── 📁 Auth/
│       │   │       ├── 🟢 InfluencerCard.vue
│       │   │       ├── 🟢 InfluencerEditForm.vue
│       │   │       ├── 🟢 InfluencerForm.vue
│       │   │       └── 🟢 LoginForm.vue
│       │   ├── 📁 layouts/
│       │   │   ├── 🟢 AdminLayout.vue
│       │   │   └── 🟢 PublicLayout.vue
│       │   ├── 📁 pages/
│       │   │   ├── 🟢 AdminDashboard.vue
│       │   │   ├── 🟢 AdminInfluencerCreate.vue
│       │   │   ├── 🟢 AdminInfluencerEdit.vue
│       │   │   ├── 🟢 HomePublic.vue
│       │   │   ├── 🟢 InfluencerProfile.vue
│       │   │   └── 🟢 InfluencerRegister.vue
│       │   ├── 📁 router/
│       │   │   └── 📄 index.ts
│       │   ├── 📁 services/
│       │   │   └── 📄 api.ts
│       │   ├── 📁 stores/
│       │   │   ├── 📄 auth.ts
│       │   │   ├── 📄 counter.ts
│       │   │   ├── 📄 influencers.ts
│       │   │   └── 📄 user.ts
│       │   ├── 📁 types/
│       │   │   └── 📄 auth.ts
│       │   ├── 📁 utils/
│       │   ├── 🟢 App.vue
│       │   └── 📄 main.ts
│       ├── 📄 .DS_Store 🚫 (auto-hidden)
│       ├── 📄 .env.example
│       ├── 🚫 .gitignore
│       ├── 📖 README.md
│       ├── 📄 env.d.ts
│       ├── 🌐 index.html
│       ├── 📄 package-lock.json
│       ├── 📄 package.json
│       ├── 📄 tailwind.config.js
│       ├── 📄 tsconfig.app.json
│       ├── 📄 tsconfig.json
│       ├── 📄 tsconfig.node.json
│       └── 📄 vite.config.ts
└── ⚙️ docker-compose.yml
```

---
*Generated by FileTree Pro Extension*