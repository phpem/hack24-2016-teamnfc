<?php

namespace AppBundle\Messaging;

use Pusher;

class PusherMessenger implements Messenger {

    /**
     * @var Pusher
     */
    private $pusher;

    /**
     * @param Pusher $pusher
     */
    public function __construct(Pusher $pusher)
    {
        $this->pusher = $pusher;
    }

    /**
     * @param       $channel
     * @param       $event
     * @param array $data
     * @param null  $socketId
     * @param bool  $debug
     *
     * @return bool|string
     */
    public function send($channel, $event, array $data, $socketId = null, $debug = false)
    {
        return $this->pusher->trigger($channel, $event, $data, $socketId, $debug);
    }
}