
> download ngrams from

- wget https://languagetool.org/download/ngram-data/<zip>
- unzip <file> -d dir
- update docker-compose for volumes location ngram

> install fasttext

- nothing to it follow https://fasttext.cc/docs/en/support.html

> make cli request

- curl -s --data "language=fr-FR&text=Première tentative" http://raspberrypi.local:8010/v2/check

> benchmarking

hyperfine --warmup 3 \
    'curl -s --data "language=en-US&text=First attempt" http://raspberrypi.local8010/v2/check' \
    'curl -s --data "language=fr-FR&text=Première tentative" http://raspberrypi.local8010/v2/check' 

potential optimizations? 
  "curl -s http://raspberrypi.local8010/v2/check?c=1 \
    --data-raw 'data=%7B%22text%22%3A%22Einen+guten+Morgen%22%7D&textSessionId=56639%3A1637566034156&enableHiddenRules=true&motherTongue=de&level=picky&language=auto&noopLanguages=de%2Cen&preferredLanguages=de%2Cen&preferredVariants=en-GB%2Cde-DE%2Cpt-BR%2Cca-ES&disabledRules=WHITESPACE_RULE%2CCONSECUTIVE_SPACES&mode=textLevelOnly'"



