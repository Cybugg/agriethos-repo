const stage:string = "dev"
const BASE_URL:string = stage === "dev"? "http://localhost:5000":stage === "prod"?"http":""