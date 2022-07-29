#!/bin/sh

if [ -d  ./.git ]; then
	TortoiseGitProc.exe /command:commit /path:./
else
	TortoiseProc.exe /command:commit /path:./
fi