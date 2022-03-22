#!/bin/bash
#usage:node --loader ts-node/esm script.ts e.g. main.ts   
display_usage() {  
	echo -e "\nUsage: $0 script.ts \n" 
	} 
# if less than two arguments supplied, display usage 
	if [  $# -ne 1 ] 
	then 
		display_usage
		exit 1
	fi 


node --loader ts-node/esm $1
