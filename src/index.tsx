import { createRoot } from 'react-dom/client';
import AppComponent from "./components/AppComponent";

const domNode = document.getElementById('app') ;
const root = createRoot(domNode);
root.render(<AppComponent />);