let inactivityTimeout;
let isListening = false;

export function startVoiceRecognition() {
    if (annyang) {
        if (!isListening) {
            const commands = {
                'search *term': function (term) {
                    searchTerm.value = term;
                    fetchArtistData(term);
                },
            };

            annyang.addCommands(commands);
            annyang.start();

            searchTerm.value = "Listening...";
            searchTerm.classList.add('listening');
            isListening = true;

            annyang.addCallback('result', function (phrases) {
                searchTerm.value = phrases[0];
                fetchArtistData(phrases[0]);
                resetInactivityTimeout();
            });

            resetInactivityTimeout();
            annyang.addCallback('start', resetInactivityTimeout);

        } else {
            annyang.abort();
            searchTerm.classList.remove('listening');
            searchTerm.value = '';
            isListening = false;
        }
    } else {
        console.log('Annyang is not supported in this browser.');
    }
}
