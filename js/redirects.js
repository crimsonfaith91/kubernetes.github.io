$( document ).ready(function() {
    var oldURLs = ["/README.md","/README.html","/index.md",".html",".md","/v1.1/","/v1.0/"];
    var fwdDirs = ["examples/","cluster/","docs/devel","docs/design"];
    var forwardingRules = [{
        "from":"/docs/api-reference/v1/definitions",
        "pattern":"#_v1_(\\w+)",
        "to":"/docs/api-reference/v1.6",
        "postfix":"/#<token>-v1-core"
    },
    {
        "from":"/docs/user-guide/kubectl/kubectl_",
        "pattern":"kubectl_(\\w+)",
        "to":"/docs/user-guide/kubectl/v1.6",
        "postfix":"/#<token>"
    }];
    var doRedirect = false;
    var notHere = false;
    var forwardingURL = window.location.href;

    var redirects = [{
        "from": "/resource-quota",
        "to": "http://kubernetes.io/docs/admin/resourcequota/"
    },
    {
        "from": "horizontal-pod-autoscaler",
        "to": "http://kubernetes.io/docs/user-guide/horizontal-pod-autoscaling/"
    },
    {
        "from": "docs/roadmap",
        "to": "https://github.com/kubernetes/kubernetes/milestones/"
    },
    {
        "from": "api-ref/",
        "to": "https://github.com/kubernetes/kubernetes/milestones/"
    },
    {
        "from": "kubernetes/third_party/swagger-ui/",
        "to": "/docs/reference"
    },
    {
        "from": "docs/user-guide/overview",
        "to": "http://kubernetes.io/docs/whatisk8s/"
    }];

    forwardingRules.forEach(function(rule) {
        if (forwardingURL.indexOf(rule.from) > -1) {
            var re = new RegExp(rule.pattern, 'g');
            var matchary = re.exec(forwardingURL);
            var newURL = rule.to;
            if (matchary !== null) {
                newURL += rule.postfix.replace("<token>", matchary[1]);
            }
            notHere = true;
            window.location.replace(newURL);
        }

    });

    for (var i = 0; i < redirects.length; i++) {
        if (forwardingURL.indexOf(redirects[i].from) > -1){
            notHere = true;
            window.location.replace(redirects[i].to);
        }
    }

    for (var i = 0; i < fwdDirs.length; i++) {
        if (forwardingURL.indexOf(fwdDirs[i]) > -1){
            var urlPieces = forwardingURL.split(fwdDirs[i]);
            var newURL = "https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/" + fwdDirs[i] + urlPieces[1];
            notHere = true;
            window.location.replace(newURL);
        }
    }

    if (!notHere) {
        for (var i = 0; i < oldURLs.length; i++) {
            if (forwardingURL.indexOf(oldURLs[i]) > -1 &&
                    forwardingURL.indexOf("404.html") < 0){
                doRedirect = true;
                forwardingURL = forwardingURL.replace(oldURLs[i],"/");
            }
        }
        if (doRedirect){
            window.location.replace(forwardingURL);
        };
    }
});
