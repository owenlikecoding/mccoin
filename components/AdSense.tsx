import Script from 'next/script';

const AdSense = () => {


    return (
        <div>


            <div dangerouslySetInnerHTML={{
                __html: `
                    <script type="text/javascript">
                        aclib.runAutoTag({
                            zoneId: 'abmvkgjtfs',
                        });
                    </script>
                ` }} />
ƒ
        </div>
    );
}

export default AdSense;