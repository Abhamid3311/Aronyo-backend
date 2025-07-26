// Interface ==> Schema/Model ==> Route ==> Controller ==> Services

## Mongoose Middleware

Pre & Post middleware

- Document Middleware : need to use basic func.
- Query Middleware :
- Aggregation Middleware :

Virtual: If we need data what don't need to save in DB but need to show in Client then we can use Virtual

## Used Technologies

- NodeJs & ExpressJs
- TypeScript (D)
- Mongoose
- CORS
- DotEnv
- Eslint
- Schema Validator: Validate Schema & applied on **Controller.ts**
  - validator
  - Joi
  - Zod
- bcrypt for password Encryption by using Mongoose hooks/midleware at **Student.model.ts**

This is Starter fort Node-TS-Mongoose backend project

All depedencies:

"dependencies":
"@types/bcrypt": "^5.0.2",
"bcrypt": "^5.1.1",
"cors": "^2.8.5",
"dotenv": "^16.5.0",
"express": "^5.1.0",
"joi": "^17.13.3",
"mongoose": "^8.14.1",
"validator": "^13.15.0",
"zod": "^3.24.3"

All dev-dependecies:

"devDependencies": {
"@eslint/js": "^9.25.1",
"@types/cors": "^2.8.17",
"@types/express": "^5.0.1",
"@types/node": "^22.15.3",
"@types/validator": "^13.15.0",
"@typescript-eslint/eslint-plugin": "^8.31.1",
"@typescript-eslint/parser": "^8.31.1",
"eslint": "^9.25.1",
"globals": "^16.0.0",
"ts-node-dev": "^2.0.0",
"typescript": "^5.8.3",
"typescript-eslint": "^8.31.1"
}
