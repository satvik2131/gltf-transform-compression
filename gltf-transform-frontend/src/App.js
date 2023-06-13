import { Canvas } from "@react-three/fiber";
import { Scene } from "./Compression";
import { OrbitControls } from "@react-three/drei";
import FileUploader from "./FileUploader";

function App() {
  return (
    <div className="App">
      <FileUploader />
    </div>
  );
}

export default App;
