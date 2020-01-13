DochBlock is a Firefox plugin for blocking climate-change denying Rupert Murdoch websites, and anything else that he owns.

It's just hacked together from
[WebsiteBlocker](https://github.com/WesleyBranton/Website-Blocker) and the lists
of websites from 
[ByeRupert](https://www.lifehacker.com.au/2014/12/bye-rupert-chrome-extension-blocks-all-news-corp-australia-sites/)

Thanks to Wesley Branton for the code and Mat Carpenter for the site list. They
did most of the work.

If you want to add extra urls, edit the firefox/sites.js file and make a
pull request. That way we all get to use the updates.


## Development
This repository contains all of the required source code files to make changes to this extension. The "master" branch contains the source code for the latest stable release. If you want to test that version, you can view the release section to download the XPI file or visit the add-on listing on Mozilla.

If you want to make changes to this extension, you are welcome to do so. All files for the extension are located in the "firefox" folder. The source code of upcoming versions (if any) will be located in another branch.

To develop and test the extension, you need to open the "about:debugging" page in Firefox and select "Load Temporary Add-on". Then you can select any file within the "firefox" folder of this repository.

Further documentation about developing Firefox extensions can be found [here](https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension).
