import 'dotenv/config'
import { Frog } from "frog";
import { mintSubnameFrame } from "./mint-subnames-frame";
import { devtools } from 'frog/dev'
import { serveStatic } from '@hono/node-server/serve-static'

export const app = new Frog()

app.route("/ens", mintSubnameFrame)

devtools(app, { serveStatic })