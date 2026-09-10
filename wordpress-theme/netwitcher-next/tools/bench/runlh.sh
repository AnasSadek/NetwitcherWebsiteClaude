#!/bin/bash
# Lighthouse matrix: pages × {wp (via gzip proxy 8081), next (3100)} × {mobile, desktop}, N runs each (median kept)
RUNS=${RUNS:-3}
PAGES=${PAGES:-"/ /portfolio/ /portfolio/frida-eu/ /leistungen/ /leistungen/webdesign-ecommerce/ /studio/ /kontakt/ /blog/"}
for page in $PAGES; do
  slug=$(echo "$page" | sed 's#^/##; s#/$##; s#/#_#g'); [ -z "$slug" ] && slug=home
  for mode in mobile desktop; do
    node lh.mjs "http://127.0.0.1:8081$page" "wp-$slug" $mode $RUNS 2>&1 | tail -1
    node lh.mjs "http://127.0.0.1:3100$page" "next-$slug" $mode $RUNS 2>&1 | tail -1
  done
done
