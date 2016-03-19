<?php

namespace AppBundle\Messaging;

interface Messenger {

    public function send($channel, $event, array $data);
}