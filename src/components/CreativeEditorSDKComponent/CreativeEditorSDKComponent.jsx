import { useEffect, useMemo, useRef } from 'react';
import CreativeEditorSDK from '@cesdk/cesdk-js';

export default function CreativeEditorSDKComponent({ handleNewImages, handleBack }) {
    const cesdk_container = useRef(null);
    const initialTrackingValues = useRef({
        addImages: handleNewImages,
        goBack: handleBack,
    })
    const handleExport = async (files, options) => {
        const { addImages, goBack } = initialTrackingValues.current
        addImages(URL.createObjectURL(files[0]));
        goBack()
    }

    const config = useMemo(() => {
        const { goBack } = initialTrackingValues.current

        return {
            license: 'mtLT-_GJwMhE7LDnO8KKEma7qSuzWuDxiKuQcxHKmz3fjaXWY2lT3o3Z2VdL5twm',
            userId: 'guides-user',
            ui: {
                elements: {
                    view: 'default', // 'default' or 'advanced'
                    navigation: {
                        show: true, // 'false' to hide the navigation completely
                        position: 'top', // 'top' or 'bottom'
                        action: {
                            close: true, // true or false
                            back: true, // true or false
                            load: true, // true or false
                            save: false, // true or false
                            export: {
                                show: true,
                                format: ['image/png']
                            },
                            download: false, // true  or false
                        }
                    },

                }
            },
            callbacks: {
                onUpload: 'local',
                onBack: goBack,
                onClose: goBack,
                onExport: (blobs, options) => {
                    handleExport(blobs, options);
                    return Promise.resolve();
                },
            }
        }
    }, [])


    useEffect(() => {
        const initCESDK = () => {
            if (!cesdk_container.current) return;


            let cleanedUp = false;
            let instance;
            CreativeEditorSDK.create(cesdk_container.current, config).then(
                async (_instance) => {
                    instance = _instance;
                    if (cleanedUp) {
                        instance.dispose();
                        return;
                    }


                    // Do something with the instance of CreativeEditor SDK, for example:
                    // Populate the asset library with default / demo asset sources.
                    await Promise.all([
                        instance.addDefaultAssetSources(),
                        instance.addDemoAssetSources({ sceneMode: 'Design' })
                    ]);
                    await instance.createDesignScene();

                    const customImagePath = `${window.location.protocol + "//" + window.location.host}/resources/lady.png`;
                    await instance.engine.asset.addAssetToSource('ly.img.image.upload', {
                        id: 'lady',
                        meta: {
                            uri: customImagePath,
                            thumbUri: customImagePath,
                            width: 1024,
                            height: 1024
                        }
                    }
                    );

                }
            );
            const cleanup = () => {
                cleanedUp = true;
                instance?.dispose();
            };
            return cleanup;
        }
        initCESDK();
    }, [config]);

    return (
        <div
            ref={cesdk_container}
            style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}
        ></div>
    );
}
