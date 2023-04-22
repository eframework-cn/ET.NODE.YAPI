#!/bin/sh

if [ -d ./.git ] || [ -f ./.git ]; then
	TortoiseGitProc.exe /command:merge /path:./
else
	TortoiseProc.exe /command:merge /path:./
fi