#!/bin/sh

if [ -d ./.git ] || [ -f ./.git ]; then
	TortoiseGitProc.exe /command:commit /path:./
else
	TortoiseProc.exe /command:commit /path:./
fi