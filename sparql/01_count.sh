curl --data-urlencode "query=SELECT (COUNT(*) as ?triples) WHERE { GRAPH <http://data-iremus.huma-num.fr/graph/mt> { ?s ?p ?o } }" http://data-iremus.huma-num.fr/sparql