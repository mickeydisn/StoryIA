# for **Scope** `**/database/**/*.md` files:

## File Format/Templating :

    - define `path` and `filename` as `**/database/{path}/{filename}.md`
    - $ find . -path "*/database_template/{path}" -name \( -name "{filename}.tpl.md" -o -name "all.tpl.md" \)
    - if a file exist: follow it as template when you create or update the files in database.
