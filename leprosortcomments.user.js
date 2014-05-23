// ==UserScript==
// @name           LeproSortComments
// @namespace      http://kt.pri.ee/lepra/
// @description    Сортирует комментарии по рейтингу
// @include        https://leprosorium.ru/comments/*
// @include        https://*.leprosorium.ru/comments/*
// ==/UserScript==

xpathOneEx = function(query, root) {
    return document.evaluate(query, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
xpathOne = function(query) {
    return xpathOneEx(query, document);
}
xpathMany = function(query) {
    return document.evaluate(query, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}

addButton = function(title, onClick) {
	var elButton = document.createElement('span');
	elButton.innerHTML = "<a href='' onclick='return false;'>" + title + "</a>";
	elButton.childNodes[0].addEventListener("click", onClick, false);
	panel = xpathOneEx("//div[@class='b-comments_controls']//span",document)
	panel.appendChild(elButton);
}

sortComments = function() {
	var comments = xpathMany("//div[@id='js-commentsHolder']/div[contains(@class,'comment')]");
	var a = Array();
	for (var i = 0; i < comments.snapshotLength; i++) {
		var elm = comments.snapshotItem(i);
		var rating = xpathOneEx("div//div[contains(@class,'vote')]/strong[@class='vote_result']", elm).innerHTML;
		a[i] = {'post': elm, 'rating': rating};
	}
	a.sort(function(a,b) { return b.rating - a.rating;});
	
	root = document.getElementById('js-commentsHolder');
	root.innerHTML='';
	for (var i = 0; i < a.length; i++) {
		root.appendChild(a[i].post);
	}
	return false;
}

addButton('Отсортировать комментарии', sortComments);
