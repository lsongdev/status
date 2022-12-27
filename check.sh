#!/usr/bin/env bash

set -x

timeout=10

check_http() {
  type="$1"
  host="$2"
  IPv="$(echo "${type}" | grep -o '[46]$')"
  ua="User-Agent: Mozilla/5.0 (X11; Linux x86_64; Debian) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
  curl -${IPv}sSkLo /dev/null -H "${ua}" -m "${timeout}" -w "%{http_code}" "$host"
}

check_ping(){
  type="$1"
  host="$2"
  IPv="$(echo "${type}" | grep -o '[46]$')"
  ping -${IPv}W "${timeout}" -c 1 "${host}" > /dev/null 2>&1
}

check_port(){
  type="$1"
  host=$(echo "$2" | cut -d'#' -f1)
  port=$(echo "$2" | cut -d'#' -f2)
  IPv="$(echo "${type}" | grep -o '[46]$')"
  nc -${IPv}w "${timeout}" -zv ${host} ${port} > /dev/null 2>&1
}

check_service() {
  name="$1"
  type="$2"
  host="$3"
  expected="$4"
  case "${type}" in
  http*)
  statuscode=$(check_http "$type" "$host")
  ;;
  ping*)
  check_ping "$type" "$host"
  statuscode=$?
  ;;
  port)
  check_port "$type" "$host"
  statuscode=$?
  ;;
  esac
  return $statuscode
}

echo "time,name,type,host,expected,result" > report.csv
cat checks.csv | while read line; do
  name=$(echo "$line" | cut -d',' -f1)
  type=$(echo "$line" | cut -d',' -f2)
  host=$(echo "$line" | cut -d',' -f3)
  expected=$(echo "$line" | cut -d',' -f4)
  check_service "$name" "$type"  "$host" "$expected"
  statuscode=$?
  echo "$line $statuscode"
  timestamp=$(date +%s)
  result=""
  # verity status and write files
  if [ "${statuscode}" -eq "${expected}" ]; then
    result="success"
  else
    result="failed"
  fi
  echo "${timestamp},${line},${result}" >> report.csv
done
