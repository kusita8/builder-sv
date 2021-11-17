import { downloadString } from "../utils"
import userSite from "./userSite"


export const exportWebsite = () => {
  const html = userSite.generateHTML();

  downloadString('index.html', html);
}