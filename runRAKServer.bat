
call venv\Scripts\activate

set FLASK_APP=RAKServer.py
REM set FLASK_DEBUG=1
echo starting flask
flask run

echo returned from starting flask