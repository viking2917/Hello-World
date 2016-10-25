function book_url (title, authorstring, bookid) {

    var title_for_url = normalize_string_for_url(title);
    var author_for_url  = normalize_string_for_url(authorstring);
    if (author_for_url == "") author_for_url = "unknown-author";

    var bookurl = "book/" + title_for_url +"--by--"+author_for_url+"--"+bookid;
    return bookurl;
}
