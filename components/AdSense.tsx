import React from 'react';
import Script from 'next/script';

type AdsenseTypes = {
    pId: string;
}

const AdSense = ({ pId }: AdsenseTypes) => {
    const [scriptLoaded, setScriptLoaded] = React.useState(false);

    const handleScriptLoad = () => {
        setScriptLoaded(true);
    };

    return (
        <div>
            <Script
                src="//acscdn.com/script/aclib.js" // Use 'src' instead of 'url'
                onLoad={handleScriptLoad}
            />
            {scriptLoaded && (
                <div dangerouslySetInnerHTML={{
                    __html: `
                    <script type="text/javascript">
                        aclib.runAutoTag({
                            zoneId: 'abmvkgjtfs',
                        });
                    </script>
                ` }} />
            )}
        </div>
    );
}

export default AdSense;