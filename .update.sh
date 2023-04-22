#!/bin/sh

if [ -d ./.git ] || [ -f ./.git ]; then
	TortoiseGitProc.exe /command:pull /path:./
else
	TortoiseProc.exe /command:update /path:./
fi