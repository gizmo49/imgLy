import { useState } from 'react';
import CreativeEditorSDKComponent from './components/CreativeEditorSDKComponent/CreativeEditorSDKComponent';
import "./App.css"

function App() {

  const [showEditor, toggleEditor] = useState(false);
  const [imgList, setImagesList] = useState([]);

  const handleNewImages = (newImg) => {
    setImagesList((prevList) => [newImg, ...prevList]);
  }

  return (
    <>

      {
        showEditor ?
          <CreativeEditorSDKComponent
            handleBack={() => toggleEditor(false)}
            handleNewImages={handleNewImages} />
          : <div>
            <div onClick={() => toggleEditor(true)} className="toggle">Open Editor</div>
            <div className="grid">
              {
                imgList.map((imgSrc, index) =>
                  <div key={index}>
                    <img src={imgSrc} alt={`img_${index}`} />
                  </div>
                )
              }
            </div>
          </div>
      }

    </>
  );
}

export default App;
