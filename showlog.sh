#!/bin/sh

if [ -d  ./.git ]; then
	TortoiseGitProc.exe /command:log /path:./
else
	TortoiseProc.exe /command:log /path:./
fi