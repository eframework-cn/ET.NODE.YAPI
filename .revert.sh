#!/bin/sh

if [ -d ./.git ] || [ -f ./.git ]; then
	TortoiseGitProc.exe /command:revert /path:./
else
	TortoiseProc.exe /command:revert /path:./
fi