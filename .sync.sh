#!/bin/sh

if [ -d ./.git ] || [ -f ./.git ]; then
	TortoiseGitProc.exe /command:sync /path:./
else
	TortoiseProc.exe /command:sync /path:./
fi