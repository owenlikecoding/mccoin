import React from 'react';

type AdsenseTypes = {
    pId: string;
}

const AdSense = ({ pId }: AdsenseTypes) => {
    const scriptContent = `
        <script type="text/javascript">
            aclib.runAutoTag({
                zoneId: 'abmvkgjtfs',
            });
        </script>
    `;

    return (
        <div dangerouslySetInnerHTML={{ __html: scriptContent }} />
    );
}

export default AdSense;