<?php

namespace AppBundle\Controller;

use AppBundle\Messaging\PusherMessenger;
use Pusher;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{

    /**
     * @Route("/", name="homepage")
     * @param Request $request
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function indexAction(Request $request)
    {
        $options = array(
            'cluster' => 'eu',
            'encrypted' => true
        );
        $pusher = new Pusher(
            'b6ac1ee705e196be3e27',
            'a5d7f09f968d03f87b51',
            '189121',
            $options
        );

        $data['message'] = 'hello world';
        $pusher->trigger('test_channel', 'my_event', $data);

        // replace this example code with whatever you need
        return $this->render('default/index.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.root_dir').'/..'),
        ]);
    }
}
