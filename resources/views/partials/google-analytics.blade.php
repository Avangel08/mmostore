@if(config('app.env') === 'production')
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-B6RH6SV8FV"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());

        gtag('config', 'G-B6RH6SV8FV');
    </script>
@endif