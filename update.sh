#!/bin/sh

if [ -d  ./.git ]; then
	TortoiseGitProc.exe /command:pull /path:./
else
	TortoiseProc.exe /command:update /path:./
fi