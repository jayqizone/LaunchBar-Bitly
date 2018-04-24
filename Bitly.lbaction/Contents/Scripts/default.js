// LaunchBar Action Script

const baseURL = 'https://api-ssl.bitly.com/v3/shorten';
const access_token = 'YOUR_ACCESS_TOKEN';

function run(theURL) {
    if (theURL = theURL && theURL.trim()) {
        if (theURL.indexOf('://') < 0) {
            theURL = 'http://' + theURL;
        }
    } else {
        theURL = LaunchBar.executeAppleScript(`
            tell application "Safari"
	            URL of item 1 of documents
            end tell
            `).trim();
    }

    if (theURL) {
        let longUrl = encodeURIComponent(theURL);
        let bitlyURL = `${baseURL}?access_token=${access_token}&longUrl=${longUrl}`
        let response = HTTP.getJSON(bitlyURL).data;
        let url;

        switch (response.status_txt) {
            case "OK":
            case "ALREADY_A_BITLY_LINK":
                url = response.data.url || theURL;
                break;
            // INVALID_URI, INVALID_ARG_ACCESS_TOKEN, RATE_LIMIT_EXCEEDED
            default:
                LaunchBar.alert(response.status_txt);
        }

        if (url) {
            LaunchBar.setClipboardString(url);

            if (LaunchBar.options.commandKey) {
                LaunchBar.displayInLargeType({
                    string: url
                });
            }
        }
    } else {
        LaunchBar.alert('No URL Specified');
    }
}
