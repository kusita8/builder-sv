import { downloadString } from "../utils"
import userSite from "./userSite"


export const exportWebsite = () => {
  const html = userSite.generateHTML();
  console.log(html)
  // downloadString('index.html', html);
}