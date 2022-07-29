#!/bin/sh

if [ -d  ./.git ]; then
	TortoiseGitProc.exe /command:cleanup /path:./
else
	TortoiseProc.exe /command:cleanup /path:./
fi