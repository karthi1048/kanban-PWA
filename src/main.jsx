import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// // Friendly SW registration with update hooks
// import { registerSW } from "virtual:pwa-register";

// const updateSW = registerSW({
//   onRegistered(r){
//     // r is the registration or promise, good for debug
//     console.log("Service worker registered: ", r);
//   },
//   onRegisterError(err){
//     console.error("SW register error: ", err);
//   },
//   onNeedRefresh(){
//     // called when new SW is waiting - you can prompt the user
//     // Eg Minimal prompt:
//     if(confirm("New version available. Refresh to update")){
//       updateSW(true);            // reloads to activate new SW
//     }
//   },
//   onOffline(){
//     console.log("App is offline");
//   }
// });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
