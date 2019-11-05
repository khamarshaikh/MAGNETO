dscl . create /Users/magneto
dscl . create /Users/magneto RealName "magneto"
dscl . create /Users/magneto hint "magneto"
dscl . passwd /Users/magneto Magneto@1234
dscl . create /Users/magneto UniqueID 550
dscl . create /Users/magneto PrimaryGroupID 20
dscl . create /Users/magneto UserShell /bin/bash
dscl . create /Users/magneto NFSHomeDirectory /Users/magneto2
cp -R /System/Library/User\ Template/English.lproj /Users/magneto
chown -R magneto:staff /Users/magneto
mkdir /Users/magneto/.ssh
ssh-keygen -P '' -f /Users/magneto/.ssh/id_dsa
sudo dseditgroup -o edit -a admin -t group staff
chown -R magneto:staff /Users/magneto/.ssh

